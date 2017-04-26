.model small
.stack 100h
.data
msg1 db 10,13,'enter first number$'
msg2 db 10,13,'enter second number$'
msgsum db 10,13,'sum is '
sum dw ?

;sum1 db ?
;sum2 db ?

msgsum1 db '$'
num1 dw 0
num2 dw 0
.code
mov ax,@data
mov ds,ax

lea dx,msg1
mov ah,9h
int 21h

mov ah,1h
int 21h

mov bl,al
sub bl,'0'

mov ah,bl

mov ah,1h
int 21h
sub al,'0'


mov num1,ax

lea dx,msg2
mov ah,9h
int 21h

mov ah,1h
int 21h

mov bl,al
sub bl,'0'

mov ah,bl

mov ah,1h
int 21h
sub al,'0'

mov num2,ax

mov ax,num1
add ax,num2

add ah,'0'
add al,'0'

;mov sum1,ah
;mov sum2,al
mov bh,al
mov bl,ah
mov sum,bx

lea dx,msgsum
mov ah,9h
int 21h

mov ah,04ch
int 21h
END



