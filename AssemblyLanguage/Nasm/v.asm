[org 0x0100]

mov ax,[u1]

mov bx,u1+2

add ax,[bx]

;mov bx,[u1+2]
;add ax,bx

mov ax,0x4c00
int 0x21

u1 dw 5,10