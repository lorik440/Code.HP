class Student
{
    public string Name="";
    public int ID = 0;
    public double GPA = 0.0;

    public Student(string name, int id, double gpa)
    {
        Name = name;
        ID = id;
        GPA = gpa;
    }
    
    public void DisplayInfo()
    {
        Console.WriteLine($"Emri: {Name}, ID: {ID}, GPA: {GPA}");
    } 

    class Program
    {
        static void Main(string[] args)
        {
            Student student1 = new Student("Lorik Bajrami", 24071051, 8.1);
            student1.DisplayInfo();
        }
    }

}