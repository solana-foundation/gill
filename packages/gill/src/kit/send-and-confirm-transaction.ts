import type { Signature } from '@solana/keys';
import type { GetEpochInfoApi, GetSignatureStatusesApi, Rpc, SendTransactionApi } from '@solana/rpc';
import type { RpcSubscriptions, SignatureNotificationsApi, SlotNotificationsApi } from '@solana/rpc-subscriptions';
import {
    createBlockHeightExceedencePromiseFactory,
    createRecentSignatureConfirmationPromiseFactory,
    waitForRecentTransactionConfirmation,
} from '@solana/transaction-confirmation';
import type { FullySignedTransaction, TransactionWithBlockhashLifetime } from '@solana/transactions';

import { sendAndConfirmTransactionWithBlockhashLifetime_INTERNAL_ONLY_DO_NOT_EXPORT } from './send-transaction-internal';
import type { CompilableTransactionMessage } from '@solana/transaction-messages';
import { signTransactionMessageWithSigners } from '@solana/signers';

export type SendAndConfirmTransactionWithBlockhashLifetimeFunction = (
    transaction: (FullySignedTransaction & TransactionWithBlockhashLifetime) | CompilableTransactionMessage,
    config?: Omit<
        Parameters<typeof sendAndConfirmTransactionWithBlockhashLifetime_INTERNAL_ONLY_DO_NOT_EXPORT>[0],
        'confirmRecentTransaction' | 'rpc' | 'transaction'
    >,
) => Promise<Signature>;

type SendAndConfirmTransactionWithBlockhashLifetimeFactoryConfig<TCluster> = {
    rpc: Rpc<GetEpochInfoApi & GetSignatureStatusesApi & SendTransactionApi> & { '~cluster'?: TCluster };
    rpcSubscriptions: RpcSubscriptions<SignatureNotificationsApi & SlotNotificationsApi> & { '~cluster'?: TCluster };
};

export function sendAndConfirmTransactionFactory({
    rpc,
    rpcSubscriptions,
}: SendAndConfirmTransactionWithBlockhashLifetimeFactoryConfig<'devnet'>): SendAndConfirmTransactionWithBlockhashLifetimeFunction;
export function sendAndConfirmTransactionFactory({
    rpc,
    rpcSubscriptions,
}: SendAndConfirmTransactionWithBlockhashLifetimeFactoryConfig<'testnet'>): SendAndConfirmTransactionWithBlockhashLifetimeFunction;
export function sendAndConfirmTransactionFactory({
    rpc,
    rpcSubscriptions,
}: SendAndConfirmTransactionWithBlockhashLifetimeFactoryConfig<'mainnet'>): SendAndConfirmTransactionWithBlockhashLifetimeFunction;
export function sendAndConfirmTransactionFactory({
    rpc,
    rpcSubscriptions,
}: SendAndConfirmTransactionWithBlockhashLifetimeFactoryConfig<'localnet'>): SendAndConfirmTransactionWithBlockhashLifetimeFunction;
export function sendAndConfirmTransactionFactory<TCluster extends 'devnet' | 'mainnet' | 'testnet' | 'localnet' | void = void>({
    rpc,
    rpcSubscriptions,
}: SendAndConfirmTransactionWithBlockhashLifetimeFactoryConfig<TCluster>): SendAndConfirmTransactionWithBlockhashLifetimeFunction {
    const getBlockHeightExceedencePromise = createBlockHeightExceedencePromiseFactory({
        rpc,
        rpcSubscriptions,
    } as Parameters<typeof createBlockHeightExceedencePromiseFactory>[0]);
    const getRecentSignatureConfirmationPromise = createRecentSignatureConfirmationPromiseFactory({
        rpc,
        rpcSubscriptions,
    } as Parameters<typeof createRecentSignatureConfirmationPromiseFactory>[0]);
    async function confirmRecentTransaction(
        config: Omit<
            Parameters<typeof waitForRecentTransactionConfirmation>[0],
            'getBlockHeightExceedencePromise' | 'getRecentSignatureConfirmationPromise'
        >,
    ) {
        await waitForRecentTransactionConfirmation({
            ...config,
            getBlockHeightExceedencePromise,
            getRecentSignatureConfirmationPromise,
        });
    }

    return async function sendAndConfirmTransaction(transaction, config = { commitment: "confirmed" }) {
        if ("messageBytes" in transaction == false){
            transaction = await signTransactionMessageWithSigners(transaction) as Readonly<FullySignedTransaction & TransactionWithBlockhashLifetime>;
        }
        return await sendAndConfirmTransactionWithBlockhashLifetime_INTERNAL_ONLY_DO_NOT_EXPORT({
            ...config,
            confirmRecentTransaction,
            rpc,
            transaction,
        });
    };
}
