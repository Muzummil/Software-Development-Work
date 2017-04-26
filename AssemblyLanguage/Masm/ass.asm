.model small ;for 16 bit
.stack 100h ;size
.data
message db 0ah,0dh, "enter number to find even or odd $"
even2 db 0ah, 0dh, "number is even $"
odd db 0ah, 0dh, "number is odd $"
.code
start:
mov ax, @data;accomulator
mov ds,ax
lea dx, message ;message's address
mov ah,9h ;for showing the messages
int 21h
mov ah,1h ; for input #1
int 21h
mov bl,al
sub bl,30h
mov ah,1h ; for input #2
int 21
sub al,30h
mov ah,bl
mov bl, 2d
aad ;ascii adjustment before division
div bl
cmp ah,0   ;remainder,o
jz even1
jnz odd1
even1:
mov dx,OFFSET even2 ;lea dx,even2
mov ah,9h
int 21h
jmp terminate
odd1:
mov dx,OFFSET odd ;OR lea dx,odd
mov ah,9h
int 21h
jmp terminate
terminate:
mov ax,4c00h
int 21h
end start

