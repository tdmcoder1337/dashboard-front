import "./products.css";


const mahsulotlar = [
    { id: 1, nomi: "iPhone 15", narx: 1200, sotildi: 34, ombor: 10 },
    { id: 2, nomi: "Samsung S24", narx: 1000, sotildi: 22, ombor: 5 },
    { id: 3, nomi: "MacBook M3", narx: 2200, sotildi: 12, ombor: 2 },
    { id: 4, nomi: "AirPods Pro", narx: 250, sotildi: 80, ombor: 25 },
    { id: 5, nomi: "iPad Pro", narx: 900, sotildi: 18, ombor: 8 },
    { id: 6, nomi: "Google Pixel 8", narx: 850, sotildi: 15, ombor: 4 },
    { id: 7, nomi: "Sony WH-1000XM5", narx: 350, sotildi: 40, ombor: 12 },
    { id: 8, nomi: "Dell XPS 13", narx: 1500, sotildi: 10, ombor: 3 },
    { id: 9, nomi: "Amazon Echo", narx: 100, sotildi: 60, ombor: 20 },
    { id: 10, nomi: "Fitbit Charge 5", narx: 180, sotildi: 25, ombor: 6 },
];


function products() {
    return (
        <div>
            <div className="products-wrapper">
                <h2 className="products-title">📦 Mahsulotlar sotuvi</h2>

                <table className="products-table">
                    <thead>
                        <tr >
                            <th>Mahsulot |</th>
                            <th>Narx |</th>
                            <th>Sotilgan |</th>
                            <th>Umumiy tushum |</th>
                            <th>Holat |</th>
                        </tr>
                    </thead>

                    <tbody>
                        {mahsulotlar.map((m) => {
                            const tushum = m.narx * m.sotildi;

                            return (
                                <tr key={m.id} className="column">
                                   <td>{m.nomi}</td>
                                        <td>${m.narx}</td>
                                        <td>{m.sotildi} ta</td>
                                        <td>${tushum}</td>

                                    <td>
                                        {m.ombor < 5 ? (
                                            <span className="status-low">Kam qolgan</span>
                                        ) : (
                                            <span className="status-ok">Yetarli</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            );

        </div>
    )
}


export default products