import java.util.*;
import java.io.*;

public class ReadInputTest {

    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(new File("example_data.csv"));) {
            while (scanner.hasNextLine()) {
                List<String> values = getValuesFromLine(scanner.nextLine());
                System.out.println("Date: " + values.get(0));
                System.out.println("Time: " + values.get(1));
                System.out.println("Value: " + values.get(2));
                System.out.println("---");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static List<String> getValuesFromLine(String line) {
        List<String> values = new ArrayList<String>();
        try (Scanner rowScanner = new Scanner(line)) {
            rowScanner.useDelimiter(";");
            while (rowScanner.hasNext()) {
                values.add(rowScanner.next());
            }
        }
        return values;
    }

}
