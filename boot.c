#include <stdio.h>
#include <errno.h>
#include <unistd.h>

int main(int argc, char** argv)
{
    char cwd[65536];
    if(getcwd(cwd, 65536) != cwd)
        return errno;

    char newCWD[strlen(cwd)+10];
    sprintf(newCWD, "%s\\goal\\bin", cwd);

    int r = chdir(newCWD);
    if(r != 0)
        return errno;

    char *const args[2] = {"app.exe", NULL};
    r = execv("app.exe", args);
    if(r != 0)
        return errno;
    return 0;
}
