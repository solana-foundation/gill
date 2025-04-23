import type { Account, Address } from "gill";

import type { Mint } from "gill/programs/token";
import { useMintAccount } from "../hooks";

// [DESCRIBE] useMintAccount
{
  const address = null as unknown as Address<"mint1234">;

  // Should use default account data type
  {
    const { account } = useMintAccount({ address });
    // Should have `exists=true` declared
    account satisfies { exists: true };
    // Should be a parsed `Mint` for the data
    account satisfies Account<Mint>;
    // Should use the address type
    account.address satisfies Address<"mint1234">;

    // @ts-expect-error - Should not allow no argument
    useMintAccount();

    // @ts-expect-error - Should not allow empty argument object
    useMintAccount({});
  }

  // Should accept `config` input
  {
    const { account } = useMintAccount({
      address,
      config: { commitment: "confirmed" },
    });
    // Should have `exists=true` declared
    account satisfies { exists: true };
    // Should be a parsed `Mint` for the data
    account satisfies Account<Mint>;
  }
}
