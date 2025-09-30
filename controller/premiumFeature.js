const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../helper/mysql'); // Assuming this is for sequelize instance
const getUserLeaderBoard = async (req, res) => {
try {
const leaderboardofusers = await User.findAll({ attributes: ['id', 'name', 'totalExpenses'], order: [['totalExpenses', 'DESC']] });
console.log(leaderboardofusers);
res.status(200).json(leaderboardofusers);
} catch (err) {
    console.log(err)
    res.status(500).json(err)
}

}
// Helper function to convert expenses to CSV format
const convertExpensesToCsv = (expenses) => {
if (!expenses || expenses.length === 0) {
return "No expenses found.";
}
const headers = ["ID", "Amount", "Description", "Category", "Date"];
const csvRows = [headers.join(',')]; // Add header row

expenses.forEach(expense => {
    const row = [
        expense.id,
        expense.amount,
        `"${expense.description.replace(/"/g, '""')}"`, // Handle commas/quotes in description
        expense.category,
        new Date(expense.createdAt).toLocaleDateString() // Format date
    ];
    csvRows.push(row.join(','));
});

return csvRows.join('\n');

};
const downloadExpenses = async (req, res) => {
try {
// req.user.id is expected to be populated by the authentication middleware
const expenses = await Expense.findAll({
where: { userId: req.user.id }, // Get expenses for the authenticated user
order: [['createdAt', 'ASC']]
});
    // Convert expenses to CSV
    const csvContent = convertExpensesToCsv(expenses);

    // Set HTTP Headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="expenses_${new Date().toISOString().slice(0, 10)}.csv"`);

    // Send the CSV content as the response
    res.status(200).send(csvContent);

} catch (error) {
    console.error('Error downloading expenses:', error);
    res.status(500).json({ message: 'Failed to download expenses.' });
}

};
module.exports = {
getUserLeaderBoard,
downloadExpenses
}