import { AddressZero } from "@ethersproject/constants";
import {
  ConnectWallet,
  useAddress,
  useContract,
  useNFTBalance,
  Web3Button,
} from "@thirdweb-dev/react";
import { Proposal, TokenHolderBalance } from "@thirdweb-dev/sdk";
import { useEffect, useMemo, useState } from "react";
import "./styles/Home.css";

export default function Home() {
  const address = useAddress();
  const editionDropAddress = import.meta.env.VITE_EDITION_DROP_ADDRESS;
  const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS;
  const voteAddress = import.meta.env.VITE_VOTE_ADDRESS;
  const { contract: editionDrop } = useContract(
    editionDropAddress,
    "edition-drop"
  );
  const { contract: token } = useContract(tokenAddress, "token");
  const { contract: vote } = useContract(voteAddress, "vote");
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0");
  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0);
  }, [nftBalance]);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState<
    TokenHolderBalance[]
  >([]);
  const [memberAddresses, setMemberAddresses] = useState<string[]>([]);

  const shortenAddress = (str: string) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllProposals = async () => {
      try {
        if (!vote) {
          throw new Error("Vote contract not found.");
        }

        const proposals = await vote.getAll();
        setProposals(proposals);

        console.log("🌈 Proposals: ", proposals);
      } catch (err) {
        console.error("🔴 Failed to get proposals: ", err);
      }
    };

    getAllProposals();
  }, [hasClaimedNFT, vote]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    if (!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        if (!vote) {
          throw new Error("Vote contract not found.");
        }

        const hasVoted = await vote.hasVoted(
          proposals[0].proposalId.toString(),
          address
        );
        setHasVoted(hasVoted);

        if (hasVoted) {
          console.log("🥰 User has already voted.");
        } else {
          console.log("😞 User has not voted yet.");
        }
      } catch (err) {
        console.error("🔴 Failed to check if wallet has voted: ", err);
      }
    };

    checkIfUserHasVoted();
  }, [hasClaimedNFT, proposals, address, vote]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllAddresses = async () => {
      try {
        const memberAddresses =
          (await editionDrop?.history.getAllClaimerAddresses(0)) ?? [];
        setMemberAddresses(memberAddresses);
        console.log(
          "✅ Member addresses succesfully retrieved: ",
          memberAddresses
        );
      } catch (err) {
        console.error("🔴 Failed to get member list: ", err);
      }
    };

    getAllAddresses();
  }, [hasClaimedNFT, editionDrop?.history]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token?.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts ?? []);

        console.log("🔒 Amounts: ", amounts);
      } catch (err) {
        console.error("🔴 Failed to get member balances: ", err);
      }
    };

    getAllBalances();
  }, [hasClaimedNFT, token?.history]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      const member = memberTokenAmounts?.find(
        ({ holder }) => holder === address
      );

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  if (!address) {
    return (
      <div className="container">
        <main className="main">
          <h1 className="title">
            Welcome to <strong>PointlessDAO</strong>!
          </h1>

          <p className="description">
            <strong>PointlessDAO</strong> is, as the name suggests, a DAO
            (decentralised autonomous organisation) with no point nor purpose.
            <br />
            It is purely for educational purposes, and to bring some distraction
            from the cold, rainy Dutch 🇳🇱 weather 😅
          </p>

          <div className="connect">
            <ConnectWallet />
          </div>
        </main>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="container">
        <main className="main">
          <h1 className="title">🫡 Pointless DAO Member Page</h1>
          <p>
            You've made it! It was pointless, but perhaps that was the whole
            idea all along?
          </p>
          <section className="members-section">
            <h2 className="subtitle">🥰 Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section className="proposals-section">
            <form
              onSubmit={async (evt) => {
                evt.preventDefault();
                evt.stopPropagation();

                setIsVoting(true);

                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    vote: 2, // Abstain by default
                  };

                  proposal.votes.forEach((vote) => {
                    const element = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (
                      element instanceof HTMLInputElement &&
                      element?.checked
                    ) {
                      voteResult.vote = vote.type;
                    }
                  });

                  return voteResult;
                });

                try {
                  if (!token) {
                    throw new Error("Token contract not found.");
                  }

                  const delegation = await token.getDelegationOf(address);

                  if (delegation === AddressZero) {
                    await token.delegateTo(address);
                  }

                  try {
                    if (!vote) {
                      throw new Error("Vote contract not found.");
                    }

                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        const proposal = await vote.get(proposalId);

                        if (proposal.state === 1) {
                          // Is proposal open?
                          return vote.vote(proposalId.toString(), _vote);
                        }
                      })
                    );

                    try {
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          const proposal = await vote.get(proposalId);

                          if (proposal.state === 4) {
                            // Is proposal ready to execute?
                            return vote.execute(proposalId.toString());
                          }
                        })
                      );

                      setHasVoted(true);

                      console.log("✅ Successfully voted.");
                    } catch (err) {
                      console.error("🔴 Failed to execute votes: ", err);
                    }
                  } catch (err) {
                    console.error("🔴 Failed to vote: ", err);
                  }
                } catch (err) {
                  console.error("🔴 Failed to delegate tokens: ", err);
                } finally {
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId.toString()} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <input
                          type="radio"
                          id={`${proposal.proposalId}-${type}`}
                          name={proposal.proposalId.toString()}
                          value={type}
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={`${proposal.proposalId}-${type}`}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                  ? "You've already voted"
                  : "Submit votes"}
              </button>
              {!hasVoted && (
                <small>
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
            </form>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <main className="main">
        <h1 className="title">Become Pointless 🔥</h1>
        <div className="btn-hero">
          <Web3Button
            contractAddress={editionDropAddress}
            action={(contract) => {
              contract.erc1155.claim(0, 1);
            }}
            onSuccess={() => {
              if (editionDrop) {
                console.log(
                  `🌊 Successfully minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`
                );
              }
            }}
            onError={(error) => {
              console.error("Failed to mint NFT: ", error);
            }}
          >
            Yes, please 🥰 (0.01 ETH)
          </Web3Button>
        </div>
      </main>
    </div>
  );
}
