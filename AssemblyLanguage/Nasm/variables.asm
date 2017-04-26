[org 0x0100]

u1 db 5
u2 db 10
mov ax,[u1]
mov bx,[u2]
add ax,bx


mov ax,0x4c00
int 0x21