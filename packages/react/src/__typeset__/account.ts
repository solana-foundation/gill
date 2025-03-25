import { Account, Address } from "gill";
import { useAccount } from "../hooks";

// [DESCRIBE] useAccount
{
  const address = null as unknown as Address;

  {
    const { account } = useAccount({ address });
    // Should have `exists=true` declared
    account satisfies { exists: true };
    // Should be a Uint8Array for the data
    account satisfies Account<Uint8Array>;

    // @ts-expect-error - Should not allow no argument
    useAccount();

    // @ts-expect-error - Should not allow empty argument object
    useAccount({});
  }

  {
    const { account } = useAccount({
      address,
      config: { commitment: "confirmed" },
    });
    // Should have `exists=true` declared
    account satisfies { exists: true };
    // Should be a Uint8Array for the data
    account satisfies Account<Uint8Array>;
  }
}
