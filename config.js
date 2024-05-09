import { http, createConfig } from "@wagmi/core";
import { polygonAmoy } from "@wagmi/core/chains";

// const projectId = "6083a3130b777c8b1a007c01b8205a2d";

export const config = createConfig({
  chains: [polygonAmoy],
  transports: {
    [80002]: http("https://polygon-amoy-bor-rpc.publicnode.com"),
  },
});
