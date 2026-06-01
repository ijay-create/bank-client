import { motion } from "framer-motion";

function BalanceCard({ title, amount }) {
  return (
    <motion.div
      className="balance-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>{title}</h3>

      <h1>{amount}</h1>
    </motion.div>
  );
}

export default BalanceCard;