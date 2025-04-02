import { Account, Address } from "gill";

import { useTokenAccount } from "../hooks/token-account";

// [DESCRIBE] useTokenAccount
{
  const mint = null as unknown as Address<"12345">;
  const owner = null as unknown as Address<"12345">;
  const ata = null as unknown as Address<"12345">;

  // Should accept mint and owner
  {
    const { account } = useTokenAccount({ mint, owner });
    // Should have `exists=true` declared
    account satisfies { exists: true };
    // Should be a Uint8Array for the data
    account satisfies Account<Uint8Array>;

    // @ts-expect-error - Should not allow no argument
    useTokenAccount();

    // @ts-expect-error - Should not allow empty argument object
    useTokenAccount({});
  }

  // Should accept `ata` input`
  {
    const { account } = useTokenAccount({ ata });
    // Should have `exists=true` declared
    account satisfies { exists: true };
    // Should be a Uint8Array for the data
    account satisfies Account<Uint8Array>;
  }
}
