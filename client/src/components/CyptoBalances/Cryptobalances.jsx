import React from "react";
import "./CryptoBalances.css";

const CryptoBalances = ({ accounts }) => {
    return (
        <div className="crypto-container">
            {accounts.map((account) => (
                <div key={account.uuid} className="crypto-card">
                    <h3>{account.name}</h3>
                    <p>{account.available_balance.value} {account.currency}</p>
                </div>
            ))}
        </div>
    );
};

export default CryptoBalances;