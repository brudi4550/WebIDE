import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.ProcessBuilder;

public class FileSystemAccessTest {

    public static void main(String[] args) {
        run("ls", "-la", "/");
    }
    
    private static void run(String... args) {
	try {
	    String output;
	    Process p = new ProcessBuilder(args).start();
	    BufferedReader br = new BufferedReader(
		new InputStreamReader(p.getInputStream()));
	    while ((output = br.readLine()) != null)
		System.out.println(output);
	    p.waitFor();
	    System.out.println ("exit: " + p.exitValue());
	    p.destroy();
	} catch (Exception e) {
	    System.out.println(e);
	}
    }
    
}
