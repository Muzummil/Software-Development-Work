.model small
.stack 100h
.data
msg1 db 'Enter first number',10,13,'$'
msg2 db 'Enter Second number',10,13 ,'$'
msg3 db 'Sum is =',13,10,'$'
ans db ?
x db 0
num1 dw 0
y db 0
num2 dw 0
.code
mov ax,@data
mov ds,ax

mov ah,9h
lea dx,msg1
int 21h

mov ah,1h
int 21h

mov x,al
sub x,'0'

mov ah,1h
int 21h
sub al,'0'

mov ah,x
mov num1,ax

mov ah,9h
lea dx,msg2
int 21h
mov ah,1h
int 21h
mov y,al
sub y,'0'



mov ah,1h
int 21h

sub al,'0'
mov ah,y

mov num2,ax


mov ah,9h
lea dx,msg3
int 21h
mov ax,num1
aaa
add ax,num2

;mov ans,ax
mov bl,10
div bl
mov ans,al
mov ans+1,ah

lea dx,ans
mov ah,9h

int 21h

mov ah,04ch
int 21h
END