import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from "chart.js";
import "../App.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
);

interface CryptoData {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
    total_volume: number;
    circulating_supply: number;
    image: string;
    sparkline_in_7d: {
        price: number[];
    };
}

const CryptoTrack: React.FC = () => {
    const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "https://api.coingecko.com/api/v3/coins/markets",
                    {
                        params: {
                            vs_currency: "usd",
                            order: "market_cap_desc",
                            per_page: 10,
                            page: 1,
                            sparkline: true,
                        },
                    }
                );
                setCryptoData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <h2 className="loading">Loading...</h2>;
    }

    return (
        <div className="crypto-table">
            <h1>Crypto Market (by OxSettings)</h1>
            <table>
                <thead>
                    <tr>
                        <th>Currency</th>
                        <th>Price</th>
                        <th>Change (24h)</th>
                        <th>Market Cap</th>
                        <th>Volume (24h)</th>
                        <th>Supply</th>
                        <th>Chart</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cryptoData.map((crypto) => (
                        <tr key={crypto.id}>
                            <td className="crypto-name">
                                <img
                                    src={crypto.image}
                                    alt={crypto.symbol}
                                    className="currency-logo"
                                />
                                {crypto.name} ({crypto.symbol.toUpperCase()})
                            </td>
                            <td>${crypto.current_price.toLocaleString()}</td>
                            <td className={crypto.price_change_percentage_24h >= 0 ? "positive-change" : "negative-change"}>
                                {crypto.price_change_percentage_24h.toFixed(2)}%
                            </td>
                            <td>${(crypto.market_cap / 1e9).toFixed(2)} B</td>
                            <td>${(crypto.total_volume / 1e9).toFixed(2)} B</td>
                            <td>{(crypto.circulating_supply / 1e6).toFixed(2)} M</td>
                            <td>
                                <Line
                                    data={{
                                        labels: Array(10).fill(""),
                                        datasets: [
                                            {
                                                label: crypto.symbol.toUpperCase(),
                                                data: crypto.sparkline_in_7d.price.slice(-10),
                                                borderColor: crypto.price_change_percentage_24h >= 0 ? "green" : "red",
                                                borderWidth: 2,
                                                tension: 0.4,
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: { display: false },
                                        },
                                        elements: {
                                            point: { radius: 0 },
                                        },
                                    }}
                                    width={100}
                                    height={30}
                                />
                            </td>
                            <td>
                                <button className="trade-btn">Trade</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CryptoTrack;
