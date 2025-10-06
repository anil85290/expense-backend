const { User, Expense, Payment, ForgotPassword } = require('./models');

// Example usage:
async function main() {
  try {
    // Create a new user
    const user = await User.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    });

    // Create a new expense for the user
    const expense = await Expense.create({
      amount: 100,
      description: 'Test expense',
      category: 'Test category',
      userId: user.id
    });

    // Create a new payment for the user
    const payment = await Payment.create({
      orderId: '12345',
      paymentSessionId: '67890',
      orderAmount: 100,
      orderCurrency: 'USD',
      paymentStatus: 'pending',
      userId: user.id
    });

    // Create a new forgot password request for the user
    const forgotPassword = await ForgotPassword.create({
      active: true,
      expiresAt: new Date(),
      userId: user.id
    });

    console.log('User created:', user);
    console.log('Expense created:', expense);
    console.log('Payment created:', payment);
    console.log('Forgot password request created:', forgotPassword);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
