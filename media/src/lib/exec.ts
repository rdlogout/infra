export async function exec(command: string): Promise<string> {
  const proc = Bun.spawn(['sh', '-c', command], {
    stdout: 'pipe',
    stderr: 'pipe',
  });

  const output = await new Response(proc.stdout).text();
  const exitCode = await proc.exited;

  if (exitCode !== 0) {
    const error = await new Response(proc.stderr).text();
    throw new Error(`Command failed: ${error}`);
  }

  return output;
}
