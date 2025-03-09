//----------------------------------------------------------------------------------------------------------------------
// Wrapper for an output stream
//----------------------------------------------------------------------------------------------------------------------

export class OutputStream {
    public readonly cursorUpIfTTY;
    public readonly DIVIDER;
    public readonly isTTY;

    //
    //------------------------------------------------------------------------------------------------------------------
    // Initialization
    //------------------------------------------------------------------------------------------------------------------

    public constructor(private readonly stdoutOrStderr: typeof process.stdout | typeof process.stderr) {
        this.cursorUpIfTTY = stdoutOrStderr.isTTY ? "\x1b[F" : "";
        this.DIVIDER = OutputStream.getDivider(stdoutOrStderr);
        this.isTTY = stdoutOrStderr.isTTY;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Calculate the divider
    //------------------------------------------------------------------------------------------------------------------

    private static getDivider(stdoutOrStderr: typeof process.stdout | typeof process.stderr) {
        const max = 120;
        const width = stdoutOrStderr.isTTY && 1 < stdoutOrStderr.columns ? stdoutOrStderr.columns : max;
        return "".padEnd(width, "-");
    }

    //------------------------------------------------------------------------------------------------------------------
    // Print a line with a trailing line break
    //------------------------------------------------------------------------------------------------------------------

    public print(message: string | ReadonlyArray<string>) {
        this.write(message);
        this.stdoutOrStderr.write("\n");
    }

    //------------------------------------------------------------------------------------------------------------------
    // Write string content without a trailing line break
    //------------------------------------------------------------------------------------------------------------------

    public write(message: string | ReadonlyArray<string>) {
        this.stdoutOrStderr.write("string" === typeof message ? message : message.join("\n"));
    }
}

export const stdout = new OutputStream(process.stdout);
export const stderr = new OutputStream(process.stderr);
