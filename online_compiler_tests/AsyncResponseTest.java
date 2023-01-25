import java.util.Timer;
import java.util.TimerTask;

public class AsyncResponseTest {
    
    public static void main(String[] args) {
	Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            private int i = 0;

            @Override
            public void run() {
                System.out.println(++i);
            }

        }, 0, 1000);
    }

}
