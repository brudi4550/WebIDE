import java.util.*;

public class Main {
    
    public static void main(String[] args) {
        System.out.println("Hello World!");
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            int i = 0;
            @Override
            public void run() {
                System.out.println(++i);
            }
        }, 0, 1000);
    }

}