#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod stablecoin_swap {
    use ink_prelude::vec::Vec;
    use ink_storage::traits::SpreadAllocate;

    /// Defines the storage of your contract.
    #[ink(storage)]
    #[derive(SpreadAllocate)]
    pub struct StablecoinSwap {
        /// The owner of the contract
        owner: AccountId,
        /// Exchange rates for different token pairs
        exchange_rates: ink_storage::Mapping<(AccountId, AccountId), u128>,
        /// Token balances
        token_balances: ink_storage::Mapping<AccountId, u128>,
    }

    /// Errors that can occur upon calling `StablecoinSwap`.
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        /// Returned if not enough balance to fulfill the request.
        InsufficientBalance,
        /// Returned if the caller is not the owner.
        NotOwner,
        /// Returned if the exchange rate is invalid.
        InvalidExchangeRate,
        /// Returned if the swap amount is zero.
        ZeroAmount,
    }

    /// Type alias for the contract's result type.
    pub type Result<T> = core::result::Result<T, Error>;

    #[ink::event]
    pub struct SwapExecuted {
        #[ink(topic)]
        from: AccountId,
        #[ink(topic)]
        to: AccountId,
        from_amount: u128,
        to_amount: u128,
    }

    #[ink::event]
    pub struct BatchSwapExecuted {
        #[ink(topic)]
        user: AccountId,
        swap_count: u32,
        total_amount: u128,
    }

    impl StablecoinSwap {
        /// Constructor that initializes the contract.
        #[ink(constructor)]
        pub fn new() -> Self {
            ink_lang::utils::initialize_contract(|contract: &mut Self| {
                contract.owner = Self::env().caller();
            })
        }

        /// Returns the owner of the contract.
        #[ink(message)]
        pub fn owner(&self) -> AccountId {
            self.owner
        }

        /// Set exchange rate for a token pair.
        #[ink(message)]
        pub fn set_exchange_rate(&mut self, from_token: AccountId, to_token: AccountId, rate: u128) -> Result<()> {
            self.ensure_owner()?;
            self.exchange_rates.insert((from_token, to_token), &rate);
            Ok(())
        }

        /// Get exchange rate for a token pair.
        #[ink(message)]
        pub fn get_exchange_rate(&self, from_token: AccountId, to_token: AccountId) -> u128 {
            self.exchange_rates.get((from_token, to_token)).unwrap_or(1000000) // Default 1:1 rate
        }

        /// Execute a single swap.
        #[ink(message)]
        pub fn execute_swap(&mut self, from_token: AccountId, to_token: AccountId, from_amount: u128) -> Result<u128> {
            if from_amount == 0 {
                return Err(Error::ZeroAmount);
            }

            let rate = self.get_exchange_rate(from_token, to_token);
            let to_amount = (from_amount * rate) / 1000000; // Rate is in basis points

            // Check if user has enough balance
            let user_balance = self.token_balances.get(self.env().caller()).unwrap_or(0);
            if user_balance < from_amount {
                return Err(Error::InsufficientBalance);
            }

            // Update balances
            self.token_balances.insert(self.env().caller(), &(user_balance - from_amount));
            
            // Add to destination token balance (simplified - in real implementation, this would be a proper token transfer)
            let to_balance = self.token_balances.get(to_token).unwrap_or(0);
            self.token_balances.insert(to_token, &(to_balance + to_amount));

            // Emit event
            self.env().emit_event(SwapExecuted {
                from: from_token,
                to: to_token,
                from_amount,
                to_amount,
            });

            Ok(to_amount)
        }

        /// Execute batch swaps.
        #[ink(message)]
        pub fn execute_batch_swap(&mut self, swaps: Vec<(AccountId, AccountId, u128)>) -> Result<u128> {
            let mut total_to_amount = 0u128;
            let caller = self.env().caller();

            for (from_token, to_token, from_amount) in swaps {
                if from_amount == 0 {
                    continue;
                }

                let rate = self.get_exchange_rate(from_token, to_token);
                let to_amount = (from_amount * rate) / 1000000;

                // Check balance
                let user_balance = self.token_balances.get(caller).unwrap_or(0);
                if user_balance < from_amount {
                    return Err(Error::InsufficientBalance);
                }

                // Update balances
                self.token_balances.insert(caller, &(user_balance - from_amount));
                
                let to_balance = self.token_balances.get(to_token).unwrap_or(0);
                self.token_balances.insert(to_token, &(to_balance + to_amount));

                total_to_amount += to_amount;
            }

            // Emit batch event
            self.env().emit_event(BatchSwapExecuted {
                user: caller,
                swap_count: swaps.len() as u32,
                total_amount: total_to_amount,
            });

            Ok(total_to_amount)
        }

        /// Get token balance for an account.
        #[ink(message)]
        pub fn get_token_balance(&self, account: AccountId) -> u128 {
            self.token_balances.get(account).unwrap_or(0)
        }

        /// Deposit tokens (for testing purposes).
        #[ink(message)]
        pub fn deposit_tokens(&mut self, amount: u128) -> Result<()> {
            let caller = self.env().caller();
            let current_balance = self.token_balances.get(caller).unwrap_or(0);
            self.token_balances.insert(caller, &(current_balance + amount));
            Ok(())
        }

        /// Ensure only owner can call this function.
        fn ensure_owner(&self) -> Result<()> {
            if self.env().caller() != self.owner {
                return Err(Error::NotOwner);
            }
            Ok(())
        }
    }

    /// Unit tests.
    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn new_works() {
            let contract = StablecoinSwap::new();
            assert_eq!(contract.owner(), AccountId::from([0x1; 32]));
        }

        #[ink::test]
        fn set_and_get_exchange_rate_works() {
            let mut contract = StablecoinSwap::new();
            let from_token = AccountId::from([0x1; 32]);
            let to_token = AccountId::from([0x2; 32]);
            let rate = 1100000; // 1.1:1 rate

            assert_eq!(contract.set_exchange_rate(from_token, to_token, rate), Ok(()));
            assert_eq!(contract.get_exchange_rate(from_token, to_token), rate);
        }
    }
}
