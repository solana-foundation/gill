import type { TransactionSigner } from "@solana/signers";
import type {
  TransactionMessageWithBlockhashLifetime,
  TransactionVersion,
} from "@solana/transaction-messages";
import type { CreateTransactionInput, Simplify } from "../../../types";

export type TransactionBuilderInput<
  TVersion extends TransactionVersion = "legacy",
  TFeePayer extends TransactionSigner = TransactionSigner,
  TLifetimeConstraint extends
    | TransactionMessageWithBlockhashLifetime["lifetimeConstraint"]
    | undefined = undefined,
> = Simplify<
  Omit<
    CreateTransactionInput<TVersion, TFeePayer, TLifetimeConstraint>,
    "version" | "instructions" | "feePayer"
  > &
    Partial<Pick<CreateTransactionInput<TVersion, TFeePayer, TLifetimeConstraint>, "version">>
>;
