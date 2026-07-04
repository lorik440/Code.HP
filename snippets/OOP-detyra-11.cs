using System;
class BankAccount
{
    private string accountNumber = "";
    private double balance = 0.0;
    public void setAccountNumber(string accNum, double initialBalance)
    {
        accountNumber = accNum;
        balance = initialBalance;
    }

    public void deposit(double amount)
    {
        balance += amount;
        Console.WriteLine("u depozituan: " + amount);
    }
    
    public void withdraw(double amount)
    {
        if (balance >= amount)
        {
            balance -= amount;
            Console.WriteLine("u tërhoqën: " + amount);
        }
        else
        {
            Console.WriteLine("Nuk ka mjaftueshëm fonde për të tërhequr: " + amount);
        }
        
    }

    public void displayBalance()
    {
        Console.WriteLine("numri i llogarisë: " + accountNumber);
        Console.WriteLine("Bilanci aktual: " + balance);
    }
}

class Program
{
    static void Main(string[] args)
    {
        BankAccount account = new BankAccount();
        account.setAccountNumber("123456789", 1000.0);
        account.displayBalance();

        account.deposit(500.0);
        account.displayBalance();

        account.withdraw(200.0);
        account.displayBalance();

        account.displayBalance();
    }
}