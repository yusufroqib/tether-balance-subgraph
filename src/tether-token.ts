import { BigInt } from "@graphprotocol/graph-ts";
import {
	Transfer,
	TetherToken,

} from "../generated/TetherToken/TetherToken";
import { Account } from "../generated/schema";

// export function handleIssue(event: Issue): void {
//   // Entities can be loaded from the store using a string ID; this ID
//   // needs to be unique across all entities of the same type
//   let entity = ExampleEntity.load(event.transaction.from)

//   // Entities only exist after they have been saved to the store;
//   // `null` checks allow to create entities on demand
//   if (!entity) {
//     entity = new ExampleEntity(event.transaction.from)

//     // Entity fields can be set using simple assignments
//     entity.count = BigInt.fromI32(0)
//   }

//   // BigInt and BigDecimal math are supported
//   // entity.count = entity.count + BigInt.fromI32(1)

//   // Entity fields can be set based on event parameters
//   entity.amount = event.params.amount

//   // Entities can be written to the store with `.save()`
//   entity.save()

//   // Note: If a handler doesn't require existing field values, it is faster
//   // _not_ to load the entity from the store. Instead, create it fresh with
//   // `new Entity(...)`, set the fields that should be updated and save the
//   // entity back to the store. Fields that were not set or unset remain
//   // unchanged, allowing for partial updates to be applied.

//   // It is also possible to access smart contracts from mappings. For
//   // example, the contract that has emitted the event can be connected to
//   // with:
//   //
//   // let contract = Contract.bind(event.address)
//   //
//   // The following functions can then be called on this contract to access
//   // state variables and other data:
//   //
//   // - contract.name(...)
//   // - contract.deprecated(...)
//   // - contract.totalSupply(...)
//   // - contract.upgradedAddress(...)
//   // - contract.balances(...)
//   // - contract.decimals(...)
//   // - contract.maximumFee(...)
//   // - contract._totalSupply(...)
//   // - contract.getBlackListStatus(...)
//   // - contract.allowed(...)
//   // - contract.paused(...)
//   // - contract.balanceOf(...)
//   // - contract.getOwner(...)
//   // - contract.owner(...)
//   // - contract.symbol(...)
//   // - contract.allowance(...)
//   // - contract.basisPointsRate(...)
//   // - contract.isBlackListed(...)
//   // - contract.MAX_UINT(...)
// }

export function handleTransfer(event: Transfer): void {
	let fromAccount = Account.load(event.params.from.toHex());
	let toAccount = Account.load(event.params.to.toHex());
	if (!fromAccount) {
		fromAccount = new Account(event.params.from.toHex());
		fromAccount.balance = BigInt.fromI32(0);
		fromAccount.save();
	}
	if (!toAccount) {
		toAccount = new Account(event.params.to.toHex());
		toAccount.balance = BigInt.fromI32(0);
		toAccount.save();
	}
	let tether = TetherToken.bind(event.address);
	let fromTokenBalance = tether.try_balanceOf(event.params.from);
	let toTokenBalance = tether.try_balanceOf(event.params.to);

	// fromAccount.balance = !fromTokenBalance.reverted && fromTokenBalance.value;
	if (!fromTokenBalance.reverted) {
		fromAccount.balance = fromTokenBalance.value;
    fromAccount.save()
	}

	if (!toTokenBalance.reverted) {
		toAccount.balance = toTokenBalance.value;
    toAccount.save()
	}
}

// export function handlePause(event: Pause): void {}

// export function handleUnpause(event: Unpause): void {}
