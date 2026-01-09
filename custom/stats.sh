docker stats --no-stream --format "{{.Name}} {{.CPUPerc}} {{.MemUsage}}" \
| grep supabase \
| awk '
{
  cpu += gensub(/%/, "", "g", $2);
  split($3, m, "/");
  mem += gensub(/MiB/, "", "g", m[1]);
}
END {
  printf "Supabase Total CPU: %.2f%%\nSupabase Total Memory: %.2f MiB\n", cpu, mem
}'
