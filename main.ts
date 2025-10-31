/**
 * Smart Disco-Roboter – Calliope Mini V3 + MotionKit V2
 */
// Korrekte Maqueen-Syntax, 3-Zug-Ausweichmanöver, Untergrundbeleuchtung & Tanzmodus
function setUnderglowCyan () {
    basic.setLedColor(0x00ffff)
    maqueen.setColor(0x00ffff)
}
function turnLeft (s: number) {
    maqueen.writeLED(maqueen.Led.LedLeft, maqueen.LedSwitch.LedOn)
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CCW, s)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, s)
}
function setUnderglowMagenta () {
    basic.setLedColor(0xff00ff)
    maqueen.setColor(0xff00ff)
}
// --- Hinderniswarnung + Ausweichlogik ---
function warnung () {
    basic.showIcon(IconNames.Square)
    for (let Index = 0; Index <= speed; Index++) {
        forward(speed - Index)
    }
    music.playTone(131, music.beat(BeatFraction.Half))
    blinkUnderglow(3)
}
// --- Start per Taste A ---
input.onButtonPressed(Button.A, function () {
    if (!(gestartet)) {
        gestartet = 1
        basic.showIcon(IconNames.Happy)
        music.startMelody(music.builtInMelody(Melodies.Chase), MelodyOptions.Once)
        discoStart()
        basic.clearScreen()
    }
})
function setUnderglowOrange () {
    basic.setLedColor(0xff8000)
    maqueen.setColor(0xff8000)
}
function backward (t: number) {
    maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CCW, t)
}
function turnOffUnderglow () {
    basic.turnRgbLedOff()
    basic.clearScreen()
    maqueen.setColor(0x000000)
}
function blinkUnderglow (times: number) {
    for (let index = 0; index < times; index++) {
        basic.setLedColor(0xffffff)
        maqueen.setColor(0xffffff)
        basic.pause(150)
        basic.turnRgbLedOff()
        maqueen.setColor(0x000000)
        basic.pause(150)
    }
}
function setUnderglowGreen () {
    basic.setLedColor(0x00ff00)
    maqueen.setColor(0x00ff00)
}
function turnRight (u: number) {
    maqueen.writeLED(maqueen.Led.LedRight, maqueen.LedSwitch.LedOn)
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, u)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, u)
}
function stopAll () {
    maqueen.motorStop(maqueen.Motors.All)
    maqueen.writeLED(maqueen.Led.LedAll, maqueen.LedSwitch.LedOff)
}
// --- Tanzmodus per A+B ---
input.onButtonPressed(Button.AB, function () {
    maqueen.motorStop(maqueen.Motors.All)
    basic.showIcon(IconNames.Heart)
    music.startMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.Once)
})
function discoStart () {
    for (let index = 0; index < 3; index++) {
        setUnderglowRed()
        basic.pause(150)
        setUnderglowGreen()
        basic.pause(150)
        setUnderglowMagenta()
        basic.pause(150)
        setUnderglowCyan()
        basic.pause(150)
    }
    turnOffUnderglow()
}
// --- Ende per Taste B ---
input.onButtonPressed(Button.B, function () {
    if (gestartet) {
        gestartet = 0
        basic.showIcon(IconNames.No)
        music.startMelody(music.builtInMelody(Melodies.PowerDown), MelodyOptions.Once)
        turnOffUnderglow()
        stopAll()
    }
})
function setUnderglowRed () {
    basic.setLedColor(0xff0000)
    maqueen.setColor(0xff0000)
}
// --- LED und Anzeige ---
function showDirection (dir2: string) {
    basic.clearScreen()
    if (dir2 == "Vor") {
        basic.showArrow(ArrowNames.South)
    } else if (dir2 == "Rueck") {
        basic.showArrow(ArrowNames.North)
    } else if (dir2 == "Links") {
        basic.showArrow(ArrowNames.East)
    } else if (dir2 == "Rechts") {
        basic.showArrow(ArrowNames.West)
    }
}
// --- Bewegungsfunktionen ---
function forward (v: number) {
    maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, v)
}
function smartAvoid () {
    // 1️⃣ Rückwärts
    richtung = "Rueck"
    showDirection(richtung)
    setUnderglowRed()
    backward(speed)
    basic.pause(700)
    stopAll()
    basic.pause(100)
    // 2️⃣ Zufällige Drehung
    if (Math.randomBoolean()) {
        richtung = "Links"
        showDirection(richtung)
        setUnderglowOrange()
        turnLeft(speed)
    } else {
        richtung = "Rechts"
        showDirection(richtung)
        setUnderglowOrange()
        turnRight(speed)
    }
    basic.pause(600)
    maqueen.writeLED(maqueen.Led.LedAll, maqueen.LedSwitch.LedOff)
    stopAll()
    basic.pause(150)
    // 3️⃣ Zweiter Versuch, falls Hindernis noch da
    distance = maqueen.ultrasonic(maqueen.DistanceUnit.Centimeters)
    if (distance > 0 && distance < 20) {
        if (richtung == "Links") {
            richtung = "Rechts"
            showDirection(richtung)
            setUnderglowOrange()
            turnRight(speed)
        } else {
            richtung = "Links"
            showDirection(richtung)
            setUnderglowOrange()
            turnLeft(speed)
        }
        basic.pause(600)
        maqueen.writeLED(maqueen.Led.LedAll, maqueen.LedSwitch.LedOff)
        stopAll()
        basic.pause(150)
    }
    // 4️⃣ Wieder vorwärts
    richtung = "Vor"
    showDirection(richtung)
    setUnderglowGreen()
    forward(speed)
    basic.pause(1000)
    basic.clearScreen()
}
let distance = 0
let richtung = ""
let gestartet = 0
let speed = 0
stopAll()
turnOffUnderglow()
speed = 50
basic.setLedColors(0xff0000, 0xff0000, 0xff0000)
maqueen.setColor(0xff0000)
basic.pause(1000)
basic.setLedColors(0xffff00, 0xffff00, 0xffff00)
maqueen.setColor(0xffff00)
basic.pause(1000)
basic.setLedColors(0x00ff00, 0x00ff00, 0x00ff00)
maqueen.setColor(0x00ff00)
basic.pause(1000)
basic.showString("A")
// --- Hauptschleife ---
basic.forever(function () {
    if (gestartet) {
        distance = maqueen.ultrasonic(maqueen.DistanceUnit.Centimeters)
        if (distance > 0 && distance <= 20) {
            warnung()
            smartAvoid()
        } else {
            richtung = "Vor"
            maqueen.writeLED(maqueen.Led.LedAll, maqueen.LedSwitch.LedOff)
            showDirection(richtung)
            setUnderglowGreen()
            forward(speed)
        }
    }
})
