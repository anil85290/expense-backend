const form = document.getElementById('expenseForm');
const amount = document.getElementById('amount');
const desc = document.getElementById('description');
const category = document.getElementById('category');
const ul = document.getElementById('expenseList');

form.addEventListener('submit', addExpense);

function addExpense(e){
    e.preventDefault();
    if (amount.value.trim() === "" || desc.value.trim() === "" || category.value.trim() === "") {
        alert("Please fill in all fields.");
        return;
    }
    let obj ={
        amount: amount.value.trim(),
        description: desc.value.trim(),
        category: category.value.trim()
    }
    axios.post("http://localhost:3000/expense/save", obj)
        .then((result) => {
            console.log(result.data);
            showExpenses(result.data);
            resetForm();
        })
        .catch((err) => {
            console.log(err);
        });
        function showExpenses(data){
            let newele = document.createElement("li");
            newele.className = "flex justify-between items-center p-2 border-b border-gray-200";
            newele.innerText = `Expense amount: ${data.amount}-${data.category}-${data.description}`;
            let dltbtn = document.createElement('button');
            dltbtn.innerText = 'Delete'
            dltbtn.className ='bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50';
            newele.appendChild(dltbtn)
            dltbtn.addEventListener('click', () => {
                dltbtn.parentElement.remove();
                axios.delete(`http://localhost:3000/expense/deletebyid/${data.id}`);
            })
            
            ul.appendChild(newele);
        };

};

window.addEventListener('DOMContentLoaded', backendExpenses);

async function backendExpenses(){
    try {
        let expenses = await axios.get('http://localhost:3000/expense/getall');
        let res = expenses.data;
        res.forEach((exp) => {
            let newele = document.createElement("li");
            newele.className = "flex justify-between items-center p-2 border-b border-gray-200";
            newele.innerText = `Expense amount: ${exp.amount}-${exp.category}-${exp.description}`;
            let dltbtn = document.createElement('button');
            dltbtn.innerText = 'Delete'
            dltbtn.className ='bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50';
            newele.appendChild(dltbtn)
            dltbtn.addEventListener('click', () => {
                dltbtn.parentElement.remove();
                axios.delete(`http://localhost:3000/expense/deletebyid/${exp.id}`);
            })
            
            ul.appendChild(newele);
        });
    } catch (error) {
        console.log(error);
    }
};

function resetForm() {
    amount.value = "";
    desc.value = "";
    category.value = "";
}