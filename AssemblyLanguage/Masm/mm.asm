.MODEL SMALL
.STACK 1000
.DATA

MSGA DB 13,10,"Input first number: ","$"
MSGB DB 13,10,"Input second number:","$"
MSGC DB 13,10,"The sum is: ","$"

NUM1 db ?
NUM2 db ?
NUM3 db ?

.CODE

MAIN PROC NEAR

MOV AX, @DATA
MOV DS, AX

; get first number
LEA DX, MSGA
MOV AH, 09h
INT 21h

MOV AH, 01
INT 21H
SUB AL, '0'

MOV BL, AL

MOV AH, 01
INT 21H
SUB AL, '0'

MOV CL, AL

; get second number
LEA DX, MSGB
MOV AH, 09h
INT 21h

MOV AH, 01
INT 21H
SUB AL, '0'

MOV DL, AL

MOV AH, 01
INT 21H
SUB AL, '0'

MOV DH, AL

; add
MOV AL, CL
MOV AH, BL
ADD AL, DH
AAA 
ADD AH, DL

MOV NUM1, AL
ADD NUM1, '0'

; if tens digit is less than or equal to 9
CMP AH, 9
JLE NOT_3DIGIT 

IS_3DIGIT:
MOV AL, AH   ; move value of ah to al
SUB AH, AH   ; clear ah
ADD AL, 0    ; al + 0 = al (tens digit)
AAA          ; move for addition
ADD AH, 0    ; ah + 0 + 1 = ah + 1 (hundreds digit)
MOV NUM2, AL
MOV NUM3, AH
ADD NUM2, '0'
ADD NUM3, '0'
; output sum
LEA DX, MSGC
MOV AH, 09h
INT 21h
MOV DL, NUM3
MOV AH, 02H
INT 21h
MOV DL, NUM2
MOV AH, 02H
INT 21h
JMP PRINT_LASTDIGIT


NOT_3DIGIT:    
MOV NUM2, AH
ADD NUM2, '0'
; output sum
LEA DX, MSGC
MOV AH, 09h
INT 21h
MOV DL, NUM2
MOV AH, 02H
INT 21h

PRINT_LASTDIGIT:
MOV DL, NUM1
MOV AH, 02H
INT 21h

EXIT:
MOV AH, 4Ch
INT 21h

MAIN ENDP
END MAIN