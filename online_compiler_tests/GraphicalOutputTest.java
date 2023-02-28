import java.awt.*;
import java.awt.event.*;
import javax.swing.*;

public class GraphicalOutputTest {

    private static void createAndShowGUI() {
        //Create and set up the window.
        JFrame frame = new JFrame("Graphical Output Test");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        JLabel emptyLabel = new JLabel("");
        emptyLabel.setPreferredSize(new Dimension(175, 100));
        frame.getContentPane().add(emptyLabel, BorderLayout.CENTER);
        frame.pack();
        frame.setVisible(true);
    }

    public static void main(String[] args) {
        javax.swing.SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                createAndShowGUI();
            }
        });
    }

}