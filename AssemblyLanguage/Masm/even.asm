.model small
.stack 100h
.data
msg1 db 'Enter number',10,13,'$'
msg2 db 'number is = even',10,13 ,'$'
msg3 db 'number is = odd',13,10,'$'

.code
mov ax,@data
mov ds,ax

mov ah,9h
lea dx,msg1
int 21h

mov ah,1h
int 21h

mov bl,al
sub bl,'0'

mov ah,1h
int 21h
sub al,'0'

mov ah,bl
mov bl,2d

aad
div bl

cmp ah,0
jz even
jnz odd
even: 
mov ah,9h
lea dx,msg2
int 21h
jmp terminate
odd: mov ah,9h
lea dx,msg3
int 21h
jmp terminate


terminate: mov ax,04ch
int 21h
END