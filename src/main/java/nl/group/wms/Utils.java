package nl.group.wms;

public class Utils {

    public static final String ANSI_RED = "\u001B[31m";     // Exceptions
    public static final String ANSI_GREEN = "\u001B[32m";   // Success
    public static final String ANSI_BLUE = "\u001B[34m";   //
    public static final String ANSI_CYAN = "\u001B[36m";    // Developer info / Debug
    public static final String ANSI_RESET = "\u001B[0m";    // Reset kleur


    /**
     * Wordt gebruikt om op een eenduidige manier gekleurde Strings te generen.
     * Aan het einde van de string wordt de kleur gereset zodat bij de eerstvolgende System.out de default kleur wordt weergegeven
     *
     * @return String in specifieke ANSI Color
     */
    public static String ic(String ANSI_COLOR, String tekst) {
        return ANSI_COLOR + tekst + ANSI_RESET;
    }

}
