import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;


if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId: clientId,
});

const contract = getContract({
  client,
  chain: defineChain(2442),
  address: "0xa1962799D1c6837272c3e06866FB60B53Cd27734",
});