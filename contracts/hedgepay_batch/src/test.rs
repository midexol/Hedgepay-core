#![cfg(test)]
use super::*;
use soroban_sdk::{Env, Address, testutils::Address as _, token::Client as TokenClient, token::StellarAssetClient};

struct TestContext {
    env: Env,
    admin: Address,
    treasury: Address,
    token_address: Address,
    token_client: TokenClient,
    token_admin_client: StellarAssetClient,
    contract_id: Address,
    contract_client: HedgePayBatchClient,
}

fn setup_test_context() -> TestContext {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let treasury = Address::generate(&env);

    let token_admin = Address::generate(&env);
    let token_address = env.register_stellar_asset_contract(token_admin.clone());
    let token_client = TokenClient::new(&env, &token_address);
    let token_admin_client = StellarAssetClient::new(&env, &token_address);

    let contract_id = env.register_contract(None, HedgePayBatch);
    let contract_client = HedgePayBatchClient::new(&env, &contract_id);

    contract_client.initialize(&admin, &treasury, &token_address);

    TestContext {
        env,
        admin,
        treasury,
        token_address,
        token_client,
        token_admin_client,
        contract_id,
        contract_client,
    }
}

#[test]
fn test_successful_batch_payout() {
    let ctx = setup_test_context();

    let payee1 = Address::generate(&ctx.env);
    let payee2 = Address::generate(&ctx.env);

    // Mint tokens to treasury
    ctx.token_admin_client.mint(&ctx.treasury, &1000);
    assert_eq!(ctx.token_client.balance(&ctx.treasury), 1000);

    // Create batch items
    let mut items = Vec::new(&ctx.env);
    items.push_back(PayoutItem {
        payee: payee1.clone(),
        amount: 300,
        department: symbol_short!("ENG"),
    });
    items.push_back(PayoutItem {
        payee: payee2.clone(),
        amount: 700,
        department: symbol_short!("HR"),
    });

    let request = BatchRequest {
        items,
        declared_total: 1000,
        batch_id: 1,
    };

    // Execute batch
    ctx.contract_client.execute_batch_payroll(&request);

    // Verify balances
    assert_eq!(ctx.token_client.balance(&ctx.treasury), 0);
    assert_eq!(ctx.token_client.balance(&payee1), 300);
    assert_eq!(ctx.token_client.balance(&payee2), 700);

    // Verify batch counter incremented
    assert_eq!(ctx.contract_client.batch_counter(), 1);
}

#[test]
#[should_panic(expected = "HostError: Error(Contract, #4)")]
fn test_sum_mismatch_too_high() {
    let ctx = setup_test_context();

    let payee1 = Address::generate(&ctx.env);
    ctx.token_admin_client.mint(&ctx.treasury, &1000);

    let mut items = Vec::new(&ctx.env);
    items.push_back(PayoutItem {
        payee: payee1,
        amount: 1000,
        department: symbol_short!("ENG"),
    });

    let request = BatchRequest {
        items,
        declared_total: 1100, // Too high
        batch_id: 1,
    };

    ctx.contract_client.execute_batch_payroll(&request);
}

#[test]
#[should_panic(expected = "HostError: Error(Contract, #4)")]
fn test_sum_mismatch_too_low() {
    let ctx = setup_test_context();

    let payee1 = Address::generate(&ctx.env);
    ctx.token_admin_client.mint(&ctx.treasury, &1000);

    let mut items = Vec::new(&ctx.env);
    items.push_back(PayoutItem {
        payee: payee1,
        amount: 1000,
        department: symbol_short!("ENG"),
    });

    let request = BatchRequest {
        items,
        declared_total: 900, // Too low
        batch_id: 1,
    };

    ctx.contract_client.execute_batch_payroll(&request);
}

#[test]
#[should_panic(expected = "HostError: Error(Contract, #5)")]
fn test_empty_batch() {
    let ctx = setup_test_context();

    let items = Vec::new(&ctx.env);

    let request = BatchRequest {
        items,
        declared_total: 0,
        batch_id: 1,
    };

    ctx.contract_client.execute_batch_payroll(&request);
}


