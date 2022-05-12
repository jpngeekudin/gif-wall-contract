import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { BuildspaceSolana } from "../target/types/buildspace_solana";

const { SystemProgram } = anchor.web3;

// describe("buildspace-solana", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.BuildspaceSolana as Program<BuildspaceSolana>;

//   it("Is initialized!", async () => {
//     // Add your test here.
//     const tx = await program.methods.initialize().rpc();
//     console.log("Your transaction signature", tx);
//   });
// });


const main = async () => {
  console.log('🚀 starting tests...');

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program: Program<BuildspaceSolana> = anchor.workspace.BuildspaceSolana;
  const baseAccount = anchor.web3.Keypair.generate();

  // const tx = await program.rpc.startStuffOff({
  //   accounts: {
  //     baseAccount: baseAccount.publicKey,
  //     user: provider.wallet.publicKey,
  //     systemProgram: SystemProgram.programId
  //   },
  //   signers: [baseAccount]
  // })

  const tx = await program.methods.startStuffOff()
    .accounts({
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId
    })
    .signers([baseAccount])
    .rpc();

  console.log('📃 your transaction signature', tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('🖼️ GIF count', account.totalGifs.toString());

  await program.methods.addGif('this is link')
    .accounts({
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    })
    .rpc();

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('🖼️ GIF count', account.totalGifs.toString());
  console.log('🖼️ GIF list', account.gifList);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  }

  catch(err) {
    console.log(err);
    process.exit(1);
  }
}

runMain();