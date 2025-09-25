const form = document.getElementById('expenseForm');
const amount = document.getElementById('amount');
const desc = document.getElementById('description');
const category = document.getElementById('category');
const ul = document.getElementById('expenseList');
const token = localStorage.getItem('token')
const premiumBtn = document.getElementById('premium');
const cashfree = Cashfree({
    mode: "sandbox",
});
premiumBtn.addEventListener('click', async () => {
    try {
        const res = await axios.post('http://localhost:3000/premium/pay', null, { headers: { "Authorization": token } });
        const data = res.data
        console.log(data);
        const paymentSessionId = data.paymentSessionId;
        const orderId = data.orderId

        let checkoutOptions = {
            paymentSessionId: paymentSessionId,

            redirectTarget: "_modal"
        };

        const result = await cashfree.checkout(checkoutOptions);
        if (result.error) {
            // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
            console.log("User has closed the popup or there is some payment error, Check for Payment Status");
            console.log(result.error);
        }
        if (result.redirect) {
            // This will be true when the payment redirection page couldnt be opened in the same window
            // This is an exceptional case only when the page is opened inside an inAppBrowser
            // In this case the customer will be redirected to return url once payment is completed
            console.log("Payment will be redirected");
        }
        if (result.paymentDetails) {
            // This will be called whenever the payment is completed irrespective of transaction status
            console.log("Payment has been completed, Check for Payment Status");
            console.log(result.paymentDetails.paymentMessage);
            const res = await axios.get(`http://localhost:3000/premium/getPaymentStatus/${orderId}`, { headers: { "Authorization": token } });
            if (res.data.paymentStatus == 'Succcessful') {
                alert('your payment is ' + res.data.paymentStatus)
                showPremiumUser();
            } else {
                alert('your payment has ' + res.data.paymentStatus)
            }

        }
    } catch (error) {
        console.log(error);
    }
});

function showPremiumUser() {
    const premiumMessage = document.createElement('div');
    premiumMessage.id = 'premiumMessage';
    premiumMessage.className = 'bg-green-500 text-white p-4 text-center';
    premiumMessage.innerText = 'You are a premium user! Enjoy your benefits!';

    // Insert the message at the top of the page
    document.body.insertBefore(premiumMessage, document.body.firstChild);
    if (premiumBtn) {
        premiumBtn.remove();
    }

    const mainContentArea = document.getElementById('mainContentArea');

    const leaderboardContainer = document.createElement('div');
    leaderboardContainer.className = 'mt-6';

    const showLeaderboardBtn = document.createElement('button');
    showLeaderboardBtn.id = 'showLeaderboardBtn';
    showLeaderboardBtn.className = 'w-full bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600';
    showLeaderboardBtn.innerText = 'Show Leaderboard';
    leaderboardContainer.appendChild(showLeaderboardBtn);

    const leaderboardDisplay = document.createElement('div');
    leaderboardDisplay.id = 'leaderboardDisplay';
    leaderboardDisplay.className = 'mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 hidden';
    leaderboardContainer.appendChild(leaderboardDisplay);

    const leaderboardTitle = document.createElement('h4');
    leaderboardTitle.className = 'text-md font-semibold mb-2';
    leaderboardTitle.innerText = 'Leaderboard';
    leaderboardDisplay.appendChild(leaderboardTitle);

    const leaderboardList = document.createElement('ul');
    leaderboardList.id = 'leaderboardList';
    leaderboardList.className = 'list-none text-gray-800';
    leaderboardDisplay.appendChild(leaderboardList);

    mainContentArea.appendChild(leaderboardContainer);

    showLeaderboardBtn.addEventListener('click', () => {
        // Toggle visibility of the leaderboard display area
        leaderboardDisplay.classList.toggle('hidden');
        if (!leaderboardDisplay.classList.contains('hidden')) {
            showLeaderboard(leaderboardList);
        }
    });
};

document.getElementById('logoutButton').addEventListener('click', () => {
    alert('Logging out...');
    window.location.href = './login.htm'
});

form.addEventListener('submit', addExpense);

function addExpense(e) {
    e.preventDefault();
    if (amount.value.trim() === "" || desc.value.trim() === "" || category.value.trim() === "") {
        alert("Please fill in all fields.");
        return;
    }
    let obj = {
        amount: amount.value.trim(),
        description: desc.value.trim(),
        category: category.value.trim()
    }
    axios.post("http://localhost:3000/expense/save", obj, { headers: { "Authorization": token } })
        .then((result) => {
            showExpenses(result.data);
            resetForm();
        })
        .catch((err) => {
            console.log(err);
        });
};

function showExpenses(data) {
    let newele = document.createElement("li");
    newele.className = "flex justify-between items-center p-2 border-b border-gray-200";
    newele.innerText = `Expense amount: ${data.amount}-${data.category}-${data.description}`;
    let dltbtn = document.createElement('button');
    dltbtn.innerText = 'Delete'
    dltbtn.className = 'bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50';
    newele.appendChild(dltbtn)
    dltbtn.addEventListener('click', () => {
        dltbtn.parentElement.remove();
        axios.delete(`http://localhost:3000/expense/deletebyid/${data.id}`, { headers: { "Authorization": token } });
    })

    ul.appendChild(newele);
};

window.addEventListener('DOMContentLoaded', backendExpenses);

async function backendExpenses() {
    try {

        let expenses = await axios.get('http://localhost:3000/expense/getall', { headers: { "Authorization": token } });
        console.log(expenses);
        let res;
        if (expenses.data.ispremiumUser == true) {
            showPremiumUser();
            res = expenses.data.exdata
        } else {
            res = expenses.data
        }
        res.forEach((exp) => {
            let newele = document.createElement("li");
            newele.className = "flex justify-between items-center p-2 border-b border-gray-200";
            newele.innerText = `Expense amount: ${exp.amount}-${exp.category}-${exp.description}`;
            let dltbtn = document.createElement('button');
            dltbtn.innerText = 'Delete'
            dltbtn.className = 'bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50';
            newele.appendChild(dltbtn)
            dltbtn.addEventListener('click', () => {
                dltbtn.parentElement.remove();
                axios.delete(`http://localhost:3000/expense/deletebyid/${exp.id}`, { headers: { "Authorization": token } });
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


async function showLeaderboard(leaderboardListElement) {
    try {
        const response = await axios.get('http://localhost:3000/premiumFeature/showLeaderBoard');
        
        const leaderboardData = response.data;
        console.log(leaderboardData);
        leaderboardListElement.innerHTML = '';

        if (leaderboardData.length === 0) {
            leaderboardListElement.innerHTML = '<li class="text-gray-600">No users on the leaderboard yet.</li>';
            return;
        }

        leaderboardData.forEach((user, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0';
            listItem.innerHTML = `
                <span class="font-medium">${index + 1}. ${user.name}</span>
                <span class="text-gray-700">Total Expense: ₹${user.total_cost}</span>
            `;
            leaderboardListElement.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        leaderboardListElement.innerHTML = '<li class="text-red-500">Failed to load leaderboard.</li>';
    }
}



