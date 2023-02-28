public class DebuggerTest {

    public static void main(String[] args) throws InterruptedException {
        int x = 0;
        for(int i = 0; i < 10; i++) {
            x += i*i;
            System.out.println(x);
            Thread.sleep(1000);
        }
    }

}