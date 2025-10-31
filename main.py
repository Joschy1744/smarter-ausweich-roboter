"""

Smart Disco-Roboter – Calliope Mini V3 + MotionKit V2

"""
# Korrekte Maqueen-Syntax, 3-Zug-Ausweichmanöver, Untergrundbeleuchtung & Tanzmodus
def setUnderglowCyan():
    basic.set_led_color(0x00ffff)
    maqueen.set_color(0x00ffff)
def turnLeft(s: number):
    maqueen.write_led(maqueen.Led.LED_LEFT, maqueen.LedSwitch.LED_ON)
    maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CCW, s)
    maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, s)
def setUnderglowMagenta():
    basic.set_led_color(0xff00ff)
    maqueen.set_color(0xff00ff)
# --- Hinderniswarnung + Ausweichlogik ---
def warnung():
    stopAll()
    basic.show_icon(IconNames.SURPRISED)
    music.play_tone(131, music.beat(BeatFraction.HALF))
    blinkUnderglow(3)
# --- Start per Taste A ---

def on_button_pressed_a():
    global gestartet
    gestartet = 1
    basic.show_icon(IconNames.HAPPY)
    music.start_melody(music.built_in_melody(Melodies.CHASE), MelodyOptions.ONCE)
    discoStart()
    basic.clear_screen()
input.on_button_pressed(Button.A, on_button_pressed_a)

def setUnderglowOrange():
    basic.set_led_color(0xff8000)
    maqueen.set_color(0xff8000)
def backward(t: number):
    maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CCW, t)
def turnOffUnderglow():
    basic.turn_rgb_led_off()
    basic.clear_screen()
    maqueen.set_color(0x000000)
def blinkUnderglow(times: number):
    for index in range(times):
        basic.set_led_color(0xffffff)
        maqueen.set_color(0xffffff)
        basic.pause(150)
        basic.turn_rgb_led_off()
        maqueen.set_color(0x000000)
        basic.pause(150)
def setUnderglowGreen():
    basic.set_led_color(0x00ff00)
    maqueen.set_color(0x00ff00)
def turnRight(u: number):
    maqueen.write_led(maqueen.Led.LED_RIGHT, maqueen.LedSwitch.LED_ON)
    maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, u)
    maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CCW, u)
def stopAll():
    maqueen.motor_stop(maqueen.Motors.ALL)
    maqueen.write_led(maqueen.Led.LED_ALL, maqueen.LedSwitch.LED_OFF)
# --- Tanzmodus per A+B ---

def on_button_pressed_ab():
    maqueen.motor_stop(maqueen.Motors.ALL)
    basic.show_icon(IconNames.HEART)
    music.start_melody(music.built_in_melody(Melodies.ENTERTAINER),
        MelodyOptions.ONCE)
    for index2 in range(2):
        forward(speed)
        maqueen.write_led(maqueen.Led.LED_ALL, maqueen.LedSwitch.LED_ON)
        setUnderglowGreen()
        basic.pause(500)
        maqueen.write_led(maqueen.Led.LED_ALL, maqueen.LedSwitch.LED_OFF)
        backward(speed)
        setUnderglowRed()
        basic.pause(500)
        maqueen.write_led(maqueen.Led.LED_LEFT, maqueen.LedSwitch.LED_ON)
        maqueen.write_led(maqueen.Led.LED_RIGHT, maqueen.LedSwitch.LED_OFF)
        turnLeft(speed)
        setUnderglowMagenta()
        basic.pause(400)
        maqueen.write_led(maqueen.Led.LED_LEFT, maqueen.LedSwitch.LED_OFF)
        maqueen.write_led(maqueen.Led.LED_RIGHT, maqueen.LedSwitch.LED_ON)
        turnRight(speed)
        setUnderglowCyan()
        basic.pause(400)
        maqueen.write_led(maqueen.Led.LED_ALL, maqueen.LedSwitch.LED_OFF)
    stopAll()
    turnOffUnderglow()
    basic.clear_screen()
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def discoStart():
    for index3 in range(3):
        setUnderglowRed()
        basic.pause(150)
        setUnderglowGreen()
        basic.pause(150)
        setUnderglowMagenta()
        basic.pause(150)
        setUnderglowCyan()
        basic.pause(150)
    turnOffUnderglow()
# --- Start per Taste A ---

def on_button_pressed_b():
    global gestartet
    gestartet = 0
    basic.show_icon(IconNames.NO)
    music.start_melody(music.built_in_melody(Melodies.POWER_DOWN),
        MelodyOptions.ONCE)
    turnOffUnderglow()
    stopAll()
input.on_button_pressed(Button.B, on_button_pressed_b)

def setUnderglowRed():
    basic.set_led_color(0xff0000)
    maqueen.set_color(0xff0000)
# --- LED und Anzeige ---
def showDirection(dir2: str):
    basic.clear_screen()
    if dir2 == "Vor":
        basic.show_arrow(ArrowNames.SOUTH)
    elif dir2 == "Rueck":
        basic.show_arrow(ArrowNames.NORTH)
    elif dir2 == "Links":
        basic.show_arrow(ArrowNames.EAST)
    elif dir2 == "Rechts":
        basic.show_arrow(ArrowNames.WEST)
# --- Bewegungsfunktionen ---
def forward(v: number):
    maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, v)
def smartAvoid():
    global richtung, distance
    # 1️⃣ Rückwärts
    richtung = "Rueck"
    showDirection(richtung)
    setUnderglowRed()
    backward(speed)
    basic.pause(700)
    stopAll()
    basic.pause(100)
    # 2️⃣ Zufällige Drehung
    if Math.random_boolean():
        richtung = "Links"
        showDirection(richtung)
        setUnderglowOrange()
        turnLeft(speed)
    else:
        richtung = "Rechts"
        showDirection(richtung)
        setUnderglowOrange()
        turnRight(speed)
    basic.pause(600)
    maqueen.write_led(maqueen.Led.LED_ALL, maqueen.LedSwitch.LED_OFF)
    stopAll()
    basic.pause(150)
    # 3️⃣ Zweiter Versuch, falls Hindernis noch da
    distance = maqueen.ultrasonic(maqueen.DistanceUnit.CENTIMETERS)
    if distance > 0 and distance < 20:
        if richtung == "Links":
            richtung = "Rechts"
            showDirection(richtung)
            setUnderglowOrange()
            turnRight(speed)
        else:
            richtung = "Links"
            showDirection(richtung)
            setUnderglowOrange()
            turnLeft(speed)
        basic.pause(600)
        maqueen.write_led(maqueen.Led.LED_ALL, maqueen.LedSwitch.LED_OFF)
        stopAll()
        basic.pause(150)
    # 4️⃣ Wieder vorwärts
    richtung = "Vor"
    showDirection(richtung)
    setUnderglowGreen()
    forward(speed)
    basic.pause(1000)
    stopAll()
    turnOffUnderglow()
    basic.clear_screen()
distance = 0
richtung = ""
gestartet = 0
speed = 0
speed = 50
basic.set_led_colors(0xff0000, 0xff0000, 0xff0000)
basic.pause(100)
basic.set_led_colors(0xff0000, 0xffff00, 0xffff00)
basic.pause(100)
basic.set_led_colors(0xff0000, 0xffff00, 0xff0000)
basic.pause(100)
basic.show_string("Druecke A")
# --- Hauptschleife ---

def on_forever():
    global distance, richtung
    if gestartet:
        distance = maqueen.ultrasonic(maqueen.DistanceUnit.CENTIMETERS)
        if distance > 0 and distance < 20:
            warnung()
            smartAvoid()
        else:
            richtung = "Vor"
            maqueen.write_led(maqueen.Led.LED_ALL, maqueen.LedSwitch.LED_OFF)
            showDirection(richtung)
            setUnderglowGreen()
            forward(speed)
    else:
        maqueen.write_led(maqueen.Led.LED_ALL, maqueen.LedSwitch.LED_OFF)
        stopAll()
        setUnderglowGreen()
        basic.show_string("Druecke A")
basic.forever(on_forever)
