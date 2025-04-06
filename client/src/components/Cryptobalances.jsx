import React from "react";

const CryptoBalances = ({ accounts }) => {
    return (
        <div>
            {accounts.map((account) => (
                <div key={account.uuid}>
                    <h3>{account.name}</h3>
                    <p>{account.available_balance.value} {account.currency}</p>
                </div>
            ))}
        </div>
    );
};

export default CryptoBalances;