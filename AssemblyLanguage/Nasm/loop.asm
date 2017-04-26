[org 0x0100]

mov ax,0
mov cx,5
mov bx,num

l1:add ax,[bx]
   add bx,2
   sub cx,1
   jnz l1


mov ax,0x4c00
int 0x21
num dw 1,2,3,4,5