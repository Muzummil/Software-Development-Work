.model small
.stack 100h
.data
msg db 10,13,'enter first number$'
msg2 db 10,13,'enter second number$'
msggr db 10,13,'first number is greater$'
msglw db 10,13,'first number is smaller$'
x db ?
y db ?
.code
mov ax,@data
mov ds,ax

lea dx,msg
mov ah,9h
int 21h

mov ah,1h
int 21h

sub al,'0'

mov x,al


lea dx,msg2
mov ah,9h
int 21h

mov ah,1h
int 21h

mov y,al
sub y,'0'



mov bl,x
cmp bl,y
jg greater1
jb lesser1

greater1:
lea dx,msggr
mov ah,9h
int 21h
jmp terminate

lesser1:
lea dx,msglw
mov ah,9h
int 21h
jmp terminate




terminate:
mov ax,04ch
int 21h
END


