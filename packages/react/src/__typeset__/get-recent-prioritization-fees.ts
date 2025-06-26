import { Address, GetRecentPrioritizationFeesApi } from "gill";
import { useGetRecentPrioritizationFees } from "../hooks";

// [DESCRIBE] useGetRecentPrioritizationFees
{
  {
    const { fees } = useGetRecentPrioritizationFees({ addresses: [] });
    fees satisfies ReturnType<GetRecentPrioritizationFeesApi["getRecentPrioritizationFees"]>;
  }

  {
    const { fees } = useGetRecentPrioritizationFees({
      addresses: ["123" as Address],
      options: {
        refetchInterval: 1000,
      },
    });
    fees satisfies ReturnType<GetRecentPrioritizationFeesApi["getRecentPrioritizationFees"]>;
  }

  {
    const { fees } = useGetRecentPrioritizationFees({
      addresses: ["123" as Address],
      abortSignal: new AbortController().signal,
    });
    fees satisfies ReturnType<GetRecentPrioritizationFeesApi["getRecentPrioritizationFees"]>;
  }
}
