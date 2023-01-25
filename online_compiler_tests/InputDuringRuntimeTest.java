import java.util.Scanner;

public class InputDuringRuntimeTest {

    public static void main(String[] args) {
	Scanner s = new Scanner(System.in);
	System.out.println("Enter a number:");
	String input = s.nextLine();
	System.out.println("You entered: " + input);
    }

}
