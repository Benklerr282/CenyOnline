
export default async function handler(req, res) {
  const { q, lang } = req.query;
  const items = [
    { id: 1, title: 'Apple iPhone 15', shopName: 'Alza', price: 899, url: 'https://www.alza.sk' },
  ];
  res.status(200).json({ items });
}
