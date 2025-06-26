import { GetTransactionApi, Signature } from "gill";
import { useGetTransaction } from "../hooks";

// [DESCRIBE] useGetTransaction
{
  {
    const { transaction } = useGetTransaction({ signature: "123" as Signature });
    transaction satisfies ReturnType<GetTransactionApi["getTransaction"]>;
  }

  {
    const { transaction } = useGetTransaction({
      signature: "123" as Signature,
      config: {
        commitment: "confirmed",
        encoding: "json",
      },
    });
    transaction satisfies ReturnType<GetTransactionApi["getTransaction"]>;
  }
  {
    const { transaction } = useGetTransaction({
      signature: "123" as Signature,
      options: {
        refetchInterval: 1000,
      },
    });
    transaction satisfies ReturnType<GetTransactionApi["getTransaction"]>;
  }

  {
    const { transaction } = useGetTransaction({
      signature: "123" as Signature,
      abortSignal: new AbortController().signal,
    });
    transaction satisfies ReturnType<GetTransactionApi["getTransaction"]>;
  }
}
