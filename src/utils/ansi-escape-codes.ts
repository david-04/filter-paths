const ANSI_ESCAPE_CODES = {
    //------------------------------------------------------------------------------------------------------------------
    // Foreground colors
    //------------------------------------------------------------------------------------------------------------------

    FG_BLACK: "\x1b[30m",
    FG_RED: "\x1b[31m",
    FG_GREEN: "\x1b[32m",
    FG_YELLOW: "\x1b[33m",
    FG_BLUE: "\x1b[34m",
    FG_MAGENTA: "\x1b[35m",
    FG_CYAN: "\x1b[36m",
    FG_WHITE: "\x1b[37m",
    FG_GRAY: "\x1b[90m",
    FG_DEFAULT: "\x1b[39m",

    //------------------------------------------------------------------------------------------------------------------
    // Background colors
    //------------------------------------------------------------------------------------------------------------------

    BG_BLACK: "\x1b[40m",
    BG_RED: "\x1b[41m",
    BG_GREEN: "\x1b[42m",
    BG_YELLOW: "\x1b[43m",
    BG_BLUE: "\x1b[44m",
    BG_MAGENTA: "\x1b[45m",
    BG_CYAN: "\x1b[46m",
    BG_WHITE: "\x1b[47m",
    BG_GRAY: "\x1b[100m",
    BG_DEFAULT: "\x1b[49m",

    //------------------------------------------------------------------------------------------------------------------
    // Brighten/darken
    //------------------------------------------------------------------------------------------------------------------

    BRIGHT: "\x1b[1m",
    NORMAL: "\x1b[22m",
    DIM: "\x1b[2m",

    //------------------------------------------------------------------------------------------------------------------
    // Lines
    //------------------------------------------------------------------------------------------------------------------

    UNDERLINE: "\x1b[4m",
    NO_UNDERLINE: "\x1b[24m",
    OVERLINE: "\x1b[53m",
    NO_OVERLINE: "\x1b[55m",
    DOUBLE_LINE: "\x1b[4m\x1b[53m",
    NO_LINE: "\x1b[24m\x1b[55m",

    //------------------------------------------------------------------------------------------------------------------
    // reset
    //----------------------------------------------------------------------------------------------------------------*/

    RESET: "\x1b[0m",
};

//----------------------------------------------------------------------------------------------------------------------
// Wrap text into ANSI escape codes
//----------------------------------------------------------------------------------------------------------------------

export const ansi = {
    //
    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "foreground black" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "foreground black" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    fgBlack: (text: string) => `${ANSI_ESCAPE_CODES.FG_BLACK}${text}${ANSI_ESCAPE_CODES.FG_DEFAULT}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "foreground red" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "foreground red" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    fgRed: (text: string) => `${ANSI_ESCAPE_CODES.FG_RED}${text}${ANSI_ESCAPE_CODES.FG_DEFAULT}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "foreground green" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "foreground green" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    fgGreen: (text: string) => `${ANSI_ESCAPE_CODES.FG_GREEN}${text}${ANSI_ESCAPE_CODES.FG_DEFAULT}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "foreground yellow" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "foreground yellow" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    fgYellow: (text: string) => `${ANSI_ESCAPE_CODES.FG_YELLOW}${text}${ANSI_ESCAPE_CODES.FG_DEFAULT}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "foreground blue" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "foreground blu" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    fgBlue: (text: string) => `${ANSI_ESCAPE_CODES.FG_BLUE}${text}${ANSI_ESCAPE_CODES.FG_DEFAULT}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "foreground magenta" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "foreground magenta" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    fgMagenta: (text: string) => `${ANSI_ESCAPE_CODES.FG_MAGENTA}${text}${ANSI_ESCAPE_CODES.FG_DEFAULT}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "foreground cyan" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped cyan "foreground red" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    fgCyan: (text: string) => `${ANSI_ESCAPE_CODES.FG_CYAN}${text}${ANSI_ESCAPE_CODES.FG_DEFAULT}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "foreground white" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "foreground white" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    fgWhite: (text: string) => `${ANSI_ESCAPE_CODES.FG_WHITE}${text}${ANSI_ESCAPE_CODES.FG_DEFAULT}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "foreground gray" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "foreground gray" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    fgGray: (text: string) => `${ANSI_ESCAPE_CODES.FG_GRAY}${text}${ANSI_ESCAPE_CODES.FG_DEFAULT}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "background black" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "background black" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    bgBlack: (text: string) => `${ANSI_ESCAPE_CODES.BG_BLACK}${text}${ANSI_ESCAPE_CODES.BG_DEFAULT}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "background red" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "background red" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    bgRed: (text: string) => `${ANSI_ESCAPE_CODES.BG_RED}${text}${ANSI_ESCAPE_CODES.BG_DEFAULT}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "background green" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "background green" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    bgGreen: (text: string) => `${ANSI_ESCAPE_CODES.BG_GREEN}${text}${ANSI_ESCAPE_CODES.BG_DEFAULT}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "background yellow" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "background yellow" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    bgYellow: (text: string) => `${ANSI_ESCAPE_CODES.BG_YELLOW}${text}${ANSI_ESCAPE_CODES.BG_DEFAULT}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "background blue" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "background blue" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    bgBlue: (text: string) => `${ANSI_ESCAPE_CODES.BG_BLUE}${text}${ANSI_ESCAPE_CODES.BG_DEFAULT}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "background magenta" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "background magenta" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    bgMagenta: (text: string) => `${ANSI_ESCAPE_CODES.BG_MAGENTA}${text}${ANSI_ESCAPE_CODES.BG_DEFAULT}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "background cyan" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "background cyan" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    bgCyan: (text: string) => `${ANSI_ESCAPE_CODES.BG_CYAN}${text}${ANSI_ESCAPE_CODES.BG_DEFAULT}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "background white" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "background white" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    bgWhite: (text: string) => `${ANSI_ESCAPE_CODES.BG_WHITE}${text}${ANSI_ESCAPE_CODES.BG_DEFAULT}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "background gray" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "background gray" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    bgGray: (text: string) => `${ANSI_ESCAPE_CODES.BG_GRAY}${text}${ANSI_ESCAPE_CODES.BG_DEFAULT}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "bright" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "bright" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    bright: (text: string) => `${ANSI_ESCAPE_CODES.BRIGHT}${text}${ANSI_ESCAPE_CODES.NORMAL}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "normal" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "normal" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    normal: (text: string) => `${ANSI_ESCAPE_CODES.NORMAL}${text}${ANSI_ESCAPE_CODES.NORMAL}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "dim(med)" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "dim(med)" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    dim: (text: string) => `${ANSI_ESCAPE_CODES.DIM}${text}${ANSI_ESCAPE_CODES.NORMAL}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "underline" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "underline" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    underline: (text: string) => `${ANSI_ESCAPE_CODES.UNDERLINE}${text}${ANSI_ESCAPE_CODES.NO_UNDERLINE}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "overline" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "overline" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    overline: (text: string) => `${ANSI_ESCAPE_CODES.OVERLINE}${text}${ANSI_ESCAPE_CODES.NO_OVERLINE}`,

    //------------------------------------------------------------------------------------------------------------------
    // Wrap the given text into "under- and overline" ANSI escape codes
    //
    // @param text The text to wrap
    // @return Returns the given text wrapped into "under- and overline" ANSI escape codes
    //------------------------------------------------------------------------------------------------------------------

    doubleLine: (text: string) => `${ANSI_ESCAPE_CODES.DOUBLE_LINE}${text}${ANSI_ESCAPE_CODES.NO_LINE}`,
} as const;

export type Ansi = typeof ansi | undefined;
