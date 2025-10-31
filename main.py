def clamp(n: number, min2: number, max2: number):
    if n < min2:
        return min2
    if n > max2:
        return max2
    return n

def on_button_pressed_a():
    l = readAnalog(sensorLeftPin)
    r = readAnalog(sensorRightPin)
    basic.show_string("L")
    basic.show_number(l)
    basic.pause(200)
    basic.show_string("R")
    basic.show_number(r)
input.on_button_pressed(Button.A, on_button_pressed_a)

"""

Linefollower für Calliope mini V3 + MotionKit 2 (MakeCode – JavaScript)

Anpassbare Parameter oben

"""
"""

Bei MotionKit 2 sind die Bewegungs- und Sensorik-Blöcke via Erweiterung verfügbar.

Wir nutzen „analoge Sensorwerte" der Linienfolgesensoren unter der Platine.

"""
rightSpeed = 0
leftSpeed = 0
turnPWM = 0
turn = 0
error = 0
normR = 0
normL = 0
invertSensors = False
# linker Linienfolgesensor (Unterseite) – analog
sensorLeftPin = AnalogPin.P0
# rechter Linienfolgesensor – analog
sensorRightPin = AnalogPin.P1
# PWM Pin für linken Motor – an MotionKit Platine
motorLeftPwmPin = AnalogPin.P8
# Richtung Pin links
motorLeftDirPin = DigitalPin.P12
# PWM Pin für rechten Motor
motorRightPwmPin = AnalogPin.P2
# Richtung Pin rechts
motorRightDirPin = DigitalPin.P13
PWM_MAX = 1023
# Regelungsparameter
baseSpeed = 400
Kp = 0.8
sensorThreshold = 600
def readAnalog(pin: AnalogPin):
    return pins.analog_read_pin(pin)
def writeAnalog(pin2: AnalogPin, value: number):
    value = clamp(Math.round(value), 0, PWM_MAX)
    pins.analog_write_pin(pin2, value)
def writeDigital(pin3: DigitalPin, value2: number):
    pins.digital_write_pin(pin3, value2)
def setMotor(pwmPin: AnalogPin, dirPin: DigitalPin, speed: number):
    global PWM_MAX
    speed = clamp(speed, -PWM_MAX, PWM_MAX)
    if speed >= 0:
        writeDigital(dirPin, 0)
        writeAnalog(pwmPin, speed)
    else:
        writeDigital(dirPin, 1)
        writeAnalog(pwmPin, -speed)
def readSensorNorm(pin4: AnalogPin):
    raw = readAnalog(pin4)
    if invertSensors:
        raw = PWM_MAX - raw
    return raw / PWM_MAX

def on_forever():
    global normL, normR, error, turn, turnPWM, leftSpeed, rightSpeed
    rawL = readAnalog(sensorLeftPin)
    rawR = readAnalog(sensorRightPin)
    if invertSensors:
        rawL = PWM_MAX - rawL
        rawR = PWM_MAX - rawR
    L_line = 1 if rawL > sensorThreshold else 0
    R_line = 1 if rawR > sensorThreshold else 0
    normL = rawL / PWM_MAX
    normR = rawR / PWM_MAX
    error = normL - normR
    turn = Kp * error
    turnPWM = turn * PWM_MAX
    leftSpeed = baseSpeed - turnPWM
    rightSpeed = baseSpeed + turnPWM
    leftSpeed = clamp(Math.round(leftSpeed), 0 - PWM_MAX, PWM_MAX)
    rightSpeed = clamp(Math.round(rightSpeed), 0 - PWM_MAX, PWM_MAX)
    if L_line == 0 and R_line == 0:
        setMotor(motorLeftPwmPin, motorLeftDirPin, 0)
        setMotor(motorRightPwmPin, motorRightDirPin, 0)
        basic.pause(50)
        setMotor(motorLeftPwmPin, motorLeftDirPin, -200)
        setMotor(motorRightPwmPin, motorRightDirPin, 200)
        basic.pause(80)
    else:
        setMotor(motorLeftPwmPin, motorLeftDirPin, leftSpeed)
        setMotor(motorRightPwmPin, motorRightDirPin, rightSpeed)
    basic.pause(10)
basic.forever(on_forever)
